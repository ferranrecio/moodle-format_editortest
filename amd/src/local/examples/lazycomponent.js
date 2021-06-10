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
 * @module     format_editortest/local/examples/lazycomponent
 * @package    core_course
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {BaseComponent} from 'core/reactive';
import {courseEditor} from 'core_courseformat/courseeditor';
import log from 'core/log';


export default class Component extends BaseComponent {

    /**
     * Constructor hook.
     */
    create() {
        // Optional component name for debugging.
        this.name = 'lazycomponent';
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
     * Note in this case we want our stateReady to be async.
     *
     * @param {object} state the initial state
     */
    async stateReady(state) {
        try {
            // First we collect some data from the state.
            const data = {title: state.course.lazytext};

            // Components are regular mustache files with an AMD module. However, if a mustache file
            // initialize a component you can use the renderComponent method to replace an element
            // by a subcomponent. It is important to note that this method should not be used for loading
            // regular mustache files as it returns a Promise that will only be resolved if the mustache has
            // a component.
            const target = this.getElement(this.selectors.CONTENT);
            this.renderComponent(target, 'format_editortest/local/examples/lazycomponent/sample', data);

        } catch (error) {
            log.error('Cannot load component template');
            throw error;
        }
    }
}
