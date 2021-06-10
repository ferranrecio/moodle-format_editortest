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
 * This is just a quick copy of format_editortest/local/examples/watcher.js example.
 *
 * @module     format_editortest/local/examples/lazycomponent/sample
 * @package    core_course
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {BaseComponent} from 'core/reactive';
import {courseEditor} from 'core_courseformat/courseeditor';


export default class Component extends BaseComponent {

    /**
     * Constructor hook.
     */
    create() {
        // Optional component name for debugging.
        this.name = 'lazycomponent/sample';
        // Default query selectors.
        this.selectors = {
            CONTENT: `[data-for='content']`,
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
    stateReady(state) {
        this._refreshContent(state.course);
    }

    getWatchers() {
        return [
            {watch: `course.samplebool:updated`, handler: this._courseWatcher},
        ];
    }

    _courseWatcher({element}) {
        this._refreshContent(element);
    }

    /**
     * A private method to refresh the content.
     *
     * @param {object} course the course state object.
     */
    _refreshContent(course) {
        const target = this.getElement(this.selectors.CONTENT);
        if (course.samplebool) {
            target.innerHTML = `The state samplebool is true`;
        } else {
            target.innerHTML = `The state samplebool is false. Click the button to toggle it.`;
        }
    }
}
