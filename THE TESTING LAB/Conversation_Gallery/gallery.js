// The approved Gallery is the only entry point.
// Scenario 1 opens Anna. Other scenarios remain visible but unconnected.
const status = document.getElementById('rw-conversations-status');

document.querySelectorAll('[data-conversation-scenario]').forEach((tile) => {
    tile.addEventListener('click', () => {
        if (tile.dataset.conversationScenario === '01') {
            window.location.href = 'anna/index.html';
            return;
        }
        status.textContent = 'This conversation will be connected after Anna is tested.';
        status.hidden = false;
    });
});

document.getElementById('rw-conversations-back').addEventListener('click', () => {
    // The Explorers Page is outside this standalone Testing Lab.
    // Keep the original Gallery intact until the host navigation is supplied.
    status.textContent = 'Back to Explorers Page will be connected when this Gallery is integrated.';
    status.hidden = false;
});
