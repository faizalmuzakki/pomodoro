// Web Worker for accurate background timing
let targetEndTime = null;
let checkInterval = null;

self.addEventListener('message', (e) => {
    const { action, data } = e.data;

    switch (action) {
        case 'start':
            targetEndTime = data.targetEndTime;
            if (checkInterval) clearInterval(checkInterval);

            checkInterval = setInterval(() => {
                const now = Date.now();
                const remaining = Math.ceil((targetEndTime - now) / 1000);

                self.postMessage({
                    type: 'tick',
                    remaining: Math.max(0, remaining)
                });

                if (remaining <= 0) {
                    self.postMessage({ type: 'complete' });
                    clearInterval(checkInterval);
                    checkInterval = null;
                    targetEndTime = null;
                }
            }, 100);
            break;

        case 'stop':
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = null;
            }
            targetEndTime = null;
            break;

        case 'check':
            if (targetEndTime) {
                const now = Date.now();
                const remaining = Math.ceil((targetEndTime - now) / 1000);
                self.postMessage({
                    type: 'tick',
                    remaining: Math.max(0, remaining)
                });
            }
            break;
    }
});

