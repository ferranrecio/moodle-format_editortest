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
 * @module     format_editortest/local/examples/subcomponents
 * @package    core_course
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {BaseComponent} from 'core/reactive';
import {getCurrentCourseEditor} from 'core_courseformat/courseeditor';
import Bold from 'format_editortest/local/examples/subcomponents/bold';
import Color from 'format_editortest/local/examples/subcomponents/color';

export default class Component extends BaseComponent {

    /**
     * Constructor hook.
     */
    create() {
        // Optional component name for debugging.
        this.name = 'subcomponents';
        // All subcomponents will use the same selectors form the parent.
        this.selectors = {
            CONTENT: `[data-for='content']`,
            BOLD: `[data-for='bold']`,
            COLOR: `[data-for='color']`,
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
        const maincomponent = new Component({
            element: document.getElementById(target),
            reactive: getCurrentCourseEditor(),
            selectors,
        });
        // Create sub components using the same descriptor.
        this.bold = new Bold(maincomponent);
        this.color = new Color(maincomponent);

        // We must return the main component always.
        return maincomponent;
    }

    // In this case the watchers and all the logic is derived to the subcomponents.
}
