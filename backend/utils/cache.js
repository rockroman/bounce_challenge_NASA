//in-memory cache implementation
const cache = {
    data: new Map(),
    // 1 hour(milliseconds)
    maxAge: 3600000,
    set: function (key, value) {
        this.data.set(key, {
            value,
            timestamp: Date.now()
        });
    },
    get: function (key) {
        const item = this.data.get(key);
        if (!item) return null;

        if (Date.now() - item.timestamp > this.maxAge) {
            this.data.delete(key);
            return null;
        }

        return item.value;
    },
    clear: function () {
        this.data.clear();
    }
};


export default cache