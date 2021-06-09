// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Test component example.
 *
 * @module     format_editortest/local/examples/stateready
 * @package    core_course
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import watcher from 'format_editortest/local/examples/watcher';
import {courseEditor} from 'core_course/courseeditor';

/**
 * Instead of creating a full component, in this case we can extend watcher
 * component to inherit all the watchers and logic.
 */
export default class Component extends watcher {

    /**
     * Constructor hook.
     */
    create() {
        // Get all the dfefinition from the parent class.
        super.create();
        // Optional component name for debugging.
        this.name = 'mutations';
        // Add some more default selectors.
        this.selectors.BUTTON = `[data-for='toggler']`;
    }

    /**
     * Static method to create a component instance form the mustahce template.
     *
     * Even if we are extending another component, this method needs to be defined
     * in every component. Otherwise, mustaches won't be able to init the component.
     * A small prize to pay comparing with the amount of code we don't have to replicate.
     *
     * @param {element|string} target the DOM main element or its ID
     * @param {object} selectors optional css selector overrides
     * @return {Component}
     */
    static init(target, selectors) {
        return new Component({
            element: document.getElementById(target),
            reactive: courseEditor,
            selectors,
        });
    }

    /**
     * Initial state ready method.
     *
     * @param {object} state the initial state
     */
    stateReady(state) {
        // In this case, we can reuse the same watchers metdhos as the parent class.
        super.stateReady(state);

        // Just bind a click listener to the component button.
        const button = this.getElement(this.selectors.BUTTON);
        this.addEventListener(button, 'click', this._clickToggler);
    }

    /**
     * Event click listener for the toggler button.
     */
    _clickToggler() {
        // Every content has a this.reactive to interact with the reactive
        // module. This way all components has a more reusable code thant interacting
        // with a specific reactive instance.

        // This is the way a component ask for mutations.
        this.reactive.dispatch('toggleCourseValue', 'samplebool');

        // When you dispatch the action the reactive module will update the state
        // and this will emit events to alert the watchers. We don't need to add
        // any logic to refresh the interface because we have watchers for this.
    }
}
