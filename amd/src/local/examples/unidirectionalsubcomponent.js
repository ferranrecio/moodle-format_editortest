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
 * Example of using subcomponents.
 *
 * @module     format_editortest/local/examples/stateready
 * @package    core_course
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {BaseComponent} from 'core/reactive';
import {courseEditor} from 'core_course/courseeditor';
import Renamer from 'format_editortest/local/examples/renamer';
import log from 'core/log';

export default class Component extends BaseComponent {

    /**
     * Constructor hook.
     */
    create() {
        // Optional component name for debugging.
        this.name = 'watcher';
        // Default query selectors.
        this.selectors = {
            CONTENT: `[data-for='content']`,
            RENAMER: `[data-for='renamer']`,
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
            reactive: courseEditor,
            selectors,
        });
    }

    /**
     * Initial state ready method.
     *
     * @param {object} state the initial state
     */
    async stateReady(state) {
        // Update the value.
        const content = this.getElement(this.selectors.CONTENT);
        content.innerHTML = state.course.samplestring2;

        // Render the subcomponent passing the input value as data.
        try {
            const target = this.getElement(this.selectors.RENAMER);
            const data = {inputvalue: state.course.samplestring2};
            this.renderComponent(target, 'format_editortest/local/examples/renamer', data);
        } catch (error) {
            log.error('Cannot load renamer template');
            throw error;
        }

        // Capture subcomponent custom events. We can know the events names from the static getEvents
        // method of the component class.
        const events = Renamer.getEvents();
        this.addEventListener(
            this.element,
            events.renamed,
            ({detail}) => {
                this._changeValue(detail.component.getValue());
            }
        );
    }

    getWatchers() {
        return [
            {watch: `course.samplestring2:updated`, handler: this._sampleWatcher},
        ];
    }

    _changeValue(newvalue) {
        this.reactive.dispatch('changeCourseValue', 'samplestring2', newvalue);
    }

    _sampleWatcher({element}) {
        const target = this.getElement(this.selectors.CONTENT);
        target.innerHTML = element.samplestring2;
    }
}
