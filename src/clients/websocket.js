export default async ({ url = "ws://localhost:80/ws", onInit, onOpen } = {}) => {
    const crypto = window.crypto;
    const socket = new WebSocket(url);
    const listeners = new Map();

    onInit?.();

    async function close() {
        socket.close();
    }

    function on(event, callback) {
        if (!listeners.has(event)) {
            const array = [callback];
            listeners.set(event, array);
            return () => array.splice(array.indexOf(callback), 1);
        }

        const listenerCallbacks = listeners.get(event);
        listenerCallbacks.push(callback);

        return () => listenerCallbacks.splice(listenerCallbacks.indexOf(callback), 1);
    }

    function invoke(event, data) {
        if (!listeners.has(event)) return;
        const listenerCallbacks = listeners.get(event);
        for (const listenerCallback of listenerCallbacks) {
            //console.log(data, typeof data)
            listenerCallback?.(data);
        }
    }

    function ping(timeout = 1000) {
        setTimeout(() => socket.ping?.(), timeout);
    };

    await new Promise((resolve, reject) => {
        socket.onopen = (data) => {
            resolve();
            onOpen?.(data);
        };
        socket.onerror = reject;
    }).catch(() => { throw new Error("connection error") });

    ping();

    socket.onerror = (error) => {
        throw new Error(error);
    };

    // eslint-disable-next-line no-unused-vars
    const userid = await new Promise((resolve, reject) => {
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (!message.event) throw new Error("event is required");

            if (message.event === "auth") {
                if (!message.userid) throw new Error("userid is required");
                resolve(message.userid);
                return;
            }

            invoke(message.event, message);
        }
    });

    const waitFor = async ({ event, event_id, id }) => {
        let close;
        return await new Promise((resolve) => {
            close = on(event, (data) => {
                if (event_id && data.event_id !== event_id) return;
                if (id && data.id !== id) return;
                resolve(data);
                close();
            });
        });
    }

    const send = async (path, event, data, event_id, extra = {}) => {
        socket.send(JSON.stringify({
            path,
            data,
            event,
            userid,
            event_id,
            ...extra,
            id: crypto.randomUUID(),
        }));
    }

    return {
        waitFor,
        socket,
        userid,
        close,
        send,
        url,
        on,
    }
}