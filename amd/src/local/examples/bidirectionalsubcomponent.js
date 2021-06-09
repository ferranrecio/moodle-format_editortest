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
            RESET: `[data-for='reset']`,
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
        content.innerHTML = state.course.samplestring3;

        // Save the reset value.
        this.resetvalue = state.course.samplestring3;

        // Bind reset button.
        const button = this.getElement(this.selectors.RESET);
        this.addEventListener(button, 'click', this._clickReset);

        try {
            const target = this.getElement(this.selectors.RENAMER);
            this.renamer = await this.renderComponent(target, 'format_editortest/local/examples/renamer', {});
            // In this case, we use a component public method to set the value, instead of the mustache data.
            this.renamer.setValue(this.resetvalue);
        } catch (error) {
            log.error('Cannot load renamer template');
            throw error;
        }

        // For bidirectional relations, we can use the event directly form the instance,
        // instead of using the static method from the abstract class.
        const events = this.renamer.events;
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
            {watch: `course.samplestring3:updated`, handler: this._sampleWatcher},
        ];
    }

    _changeValue(newvalue) {
        this.reactive.dispatch('changeCourseValue', 'samplestring3', newvalue);
    }

    _sampleWatcher({element}) {
        const target = this.getElement(this.selectors.CONTENT);
        target.innerHTML = element.samplestring3;
    }

    _clickReset() {
        this.reactive.dispatch('toggleCourseValue', 'samplestring3', this.resetvalue);
        if (this.renamer !== undefined) {
            this.renamer.setValue(this.resetvalue);
            this._changeValue(this.resetvalue);
        }
    }
}
