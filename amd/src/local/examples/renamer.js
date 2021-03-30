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
 * This is a subcomponent that can be reused in several compoments to
 * add a debounced input with a value.
 *
 * @module     format_editortest/local/examples/stateready
 * @package    core_course
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {BaseComponent} from 'core/reactive';
import courseeditor from 'core_course/courseeditor';
import {debounce} from 'core/utils';

export default class Component extends BaseComponent {

    static getEvents() {
        return {
            renamed: 'renamevalue_changed',
        };
    }

    /**
     * Constructor hook.
     */
    create() {
        // Optional component name for debugging.
        this.name = 'renamer';
        // Default query selectors.
        this.selectors = {
            INPUT: `input`,
        };
    }

    /**
     * Static method to create a component instance form the mustahce template.
     *
     * We use a static method to prevent mustache templates to know which
     * reactive instance is used.
     *
     * @param {element|string} target the DOM main element or its ID
     * @param {object} selectors optional css selector overrides
     * @return {Component}
     */
    static init(target, selectors) {
        return new Component({
            element: document.getElementById(target),
            reactive: courseeditor,
            selectors,
        });
    }

    /**
     * Initial state ready method.
     */
    stateReady() {
        // In this case we don't care at all about the state. We simply use
        // stateReady because is easier thant defining a onReady metdhos.
        // To load the initial state the page should be ready.

        const input = this.getElement(this.selectors.INPUT);

        // This component will trigger an event. The BaseComponent class has a shortcut to trigger
        // events. We can use this one or create a new one, it's up to you. The important point is that
        // you use standard JS evenets and trigger them anchoring this.element with bubbling.

        // In this we want to debounce the listener to prevent unnecessary state mutations.
        const debounceddispatch = debounce(() => {
            // Probably we would need some content check for savety, but I trust you won't
            // add malitious content to any input field ;-).

            // Passing the component as part of the event is the best way to let other
            // components interact with you.
            this.dispatchEvent(
                this.events.renamed,
                {component: this},
            );
        }, 250);

        this.addEventListener(input, 'keyup', debounceddispatch);
    }

    /**
     * A public method to set the input value.
     *
     * @param {string} value the new input value.
     */
    setValue(value) {
        const target = this.getElement(this.selectors.INPUT);
        if (target.value !== value) {
            target.value = value;
        }
    }

    /**
     * Public method to get the input value.
     *
     * @returns {string} the current input value
     */
    getValue() {
        return this.getElement(this.selectors.INPUT).value;
    }
}
