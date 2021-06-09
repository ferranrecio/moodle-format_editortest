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
 * @module     format_editortest/local/examples/unregister
 * @package    core_course
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {BaseComponent} from 'core/reactive';
import {courseEditor} from 'core_course/courseeditor';
import Displayer from 'format_editortest/local/examples/unregister/displayer';

export default class Component extends BaseComponent {

    /**
     * Constructor hook.
     */
    create() {
        // Optional component name for debugging.
        this.name = 'unregister';
        // Default query selectors.
        this.selectors = {
            CONTENT: `[data-for='content']`,
            BUTTON: `[data-for='toggler']`,
            BOLD: `[data-for='bold']`,
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
    stateReady() {
        this._clickToggler();

        // Just bind a click listener to the component button.
        const button = this.getElement(this.selectors.BUTTON);
        this.addEventListener(button, 'click', this._clickToggler);
    }

    /**
     * Event click listener for the toggler button.
     */
    _clickToggler() {
        if (this.subcomponent === undefined) {
            // Create a new displayer component.
            this._createSubcomponent();
            this.getElement(this.selectors.BUTTON).innerHTML = 'Unregister component';
        } else {
            // Remove the current displayer component.
            this._unregisterSubcomponent();
            this.getElement(this.selectors.BUTTON).innerHTML = 'New component';
        }
    }

    /**
     * Register a new subcomponent.
     */
    async _createSubcomponent() {
        this.subcomponent = new Displayer(this);
    }


    /**
     * Unregister the current subcomponents.
     */
    _unregisterSubcomponent() {
        // In principle, every component is responsible for knowing its own reactive.
        // For this reason eaci component has a "unregister" method. It is not the same
        // case as removeComponent which is always called from the same parent Component
        // that call renderComponent.
        this.subcomponent.unregister();
        this.subcomponent = undefined;
    }
}
