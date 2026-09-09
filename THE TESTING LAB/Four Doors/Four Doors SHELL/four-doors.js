// ==================================================
// MICHAEL'S FOUNDATIONS
// FOUR DOORS — PORTABLE COMPONENT
// Reference architecture extracted from
// Greetings & Introductions EXPLORE
// ==================================================

(() => {
    "use strict";

    const component = document.querySelector("#four-doors-component");

    if (!component) {
        return;
    }

    const threshold = component.querySelector("#four-doors-threshold");
    const status = component.querySelector("#four-doors-status");
    const doors = [...component.querySelectorAll(".four-doors__door[data-four-door]")];
    const rooms = [...component.querySelectorAll(".four-doors__room[data-four-room]")];

    // ==================================================
    // FOUR DOORS — COMPONENT STATE
    // The shell owns only navigation state.
    // Foundation-specific learning state belongs inside
    // the individual Door content.
    // ==================================================

    const fourDoorsState = {
        activeDoor: null,
        visitedDoors: new Set(),
        completedDoors: new Set()
    };

    let lastDoorButton = null;

    // ==================================================
    // FOUR DOORS — HELPERS
    // ==================================================

    function getDoorButton(doorNumber) {
        return component.querySelector(
            `.four-doors__door[data-four-door="${doorNumber}"]`
        );
    }

    function getRoom(doorNumber) {
        return component.querySelector(
            `.four-doors__room[data-four-room="${doorNumber}"]`
        );
    }

    function prefersReducedMotion() {
        return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    }

    function scrollToElement(element) {
        if (!element) {
            return;
        }

        element.scrollIntoView({
            behavior: prefersReducedMotion() ? "auto" : "smooth",
            block: "start"
        });
    }

    function updateDoorStates() {
        doors.forEach((door) => {
            const doorNumber = door.dataset.fourDoor;
            const isActive = fourDoorsState.activeDoor === doorNumber;
            const isVisited = fourDoorsState.visitedDoors.has(doorNumber);
            const isCompleted = fourDoorsState.completedDoors.has(doorNumber);

            door.setAttribute("aria-expanded", String(isActive));
            door.classList.toggle("is-visited", isVisited);
            door.classList.toggle("is-completed", isCompleted);
        });
    }

    function announce(message) {
        if (status) {
            status.textContent = message;
        }
    }

    // ==================================================
    // FOUR DOORS — OPEN A DOOR
    // Based on the G&I hallway -> room behavior,
    // consolidated into one reusable navigation function.
    // ==================================================

    function openDoor(doorNumber, sourceButton) {
        const room = getRoom(doorNumber);

        if (!threshold || !room) {
            return;
        }

        // Close any room that might already be open.
        rooms.forEach((otherRoom) => {
            otherRoom.hidden = true;
        });

        fourDoorsState.activeDoor = doorNumber;
        fourDoorsState.visitedDoors.add(doorNumber);
        lastDoorButton = sourceButton || getDoorButton(doorNumber);

        threshold.hidden = true;
        room.hidden = false;

        updateDoorStates();

        // Move keyboard/screen-reader focus into the opened room.
        room.focus({ preventScroll: true });
        scrollToElement(room);
    }

    // ==================================================
    // FOUR DOORS — RETURN TO THE THRESHOLD
    // ==================================================

    function returnToDoors() {
        const previousDoor = lastDoorButton;

        rooms.forEach((room) => {
            room.hidden = true;
        });

        fourDoorsState.activeDoor = null;

        if (threshold) {
            threshold.hidden = false;
        }

        updateDoorStates();
        scrollToElement(threshold);

        // Return focus to the exact Door the learner left.
        window.setTimeout(() => {
            previousDoor?.focus({ preventScroll: true });
        }, prefersReducedMotion() ? 0 : 250);
    }

    // ==================================================
    // FOUR DOORS — EVENT LISTENERS
    // Native <button> controls provide mouse, touch,
    // Enter, and Space activation without extra key code.
    // ==================================================

    doors.forEach((door) => {
        door.addEventListener("click", () => {
            openDoor(door.dataset.fourDoor, door);
        });
    });

    component.querySelectorAll(".four-doors__return").forEach((button) => {
        button.addEventListener("click", returnToDoors);
    });

    // ==================================================
    // FOUR DOORS — OPTIONAL PUBLIC API
    // Foundation content can call these without the shell
    // needing to know how an individual Door teaches.
    // ==================================================

    component.fourDoors = {
        openDoor(doorNumber) {
            const key = String(doorNumber);
            openDoor(key, getDoorButton(key));
        },

        returnToDoors,

        markComplete(doorNumber, isComplete = true) {
            const key = String(doorNumber);

            if (isComplete) {
                fourDoorsState.completedDoors.add(key);
                announce(`Door ${key} marked complete.`);
            } else {
                fourDoorsState.completedDoors.delete(key);
                announce(`Door ${key} completion cleared.`);
            }

            updateDoorStates();
        },

        getState() {
            return {
                activeDoor: fourDoorsState.activeDoor,
                visitedDoors: [...fourDoorsState.visitedDoors],
                completedDoors: [...fourDoorsState.completedDoors]
            };
        },

        resetNavigationState() {
            fourDoorsState.activeDoor = null;
            fourDoorsState.visitedDoors.clear();
            fourDoorsState.completedDoors.clear();
            lastDoorButton = null;

            rooms.forEach((room) => {
                room.hidden = true;
            });

            threshold.hidden = false;
            updateDoorStates();
            announce("Four Doors navigation reset.");
        }
    };

    // Initial state.
    updateDoorStates();
})();
