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
 * @module     format_editortest/local/examples/subcomponents/bold
 * @package    core_course
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {BaseComponent} from 'core/reactive';

export default class Component extends BaseComponent {

    /**
     * Constructor hook.
     */
    create() {
        // Optional component name for debugging.
        this.name = 'bold';

        // This module will use the parent component selectors.
    }

    // This is an internal submodule so it does not need any init module
    // asthis module won't be initialized from a mustache file.

    /**
     * Initial state ready method.
     *
     * @param {object} state the initial state
     */
    stateReady(state) {
        this._refreshContent(state.course);

        // Bind button action.
        // Just bind a click listener to the component button.
        const button = this.getElement(this.selectors.BOLD);
        this.addEventListener(button, 'click', this._clickBoldToggler);
    }

    getWatchers() {
        return [
            {watch: `course.myformat:updated`, handler: this._watcher},
        ];
    }

    _watcher({element}) {
        this._refreshContent(element);
    }

    /**
     * A private method to refresh the content.
     *
     * @param {object} course the course state object.
     */
    _refreshContent(course) {
        const target = this.getElement(this.selectors.CONTENT);
        if (course.myformat.bold) {
            target.style.fontWeight = 'bold';
        } else {
            target.style.fontWeight = 'inherit';
        }
    }

    /**
     * Event click listener for the toggler button.
     */
    _clickBoldToggler() {
        // We get the current state value directly from our reactive.
        const state = this.reactive.getState();
        let bold = state.course.myformat.bold;

        // This is the way a component ask for mutations.
        this.reactive.dispatch('changeMyFormat', 'bold', !bold);
    }
}
