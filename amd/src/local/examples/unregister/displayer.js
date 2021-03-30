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
 * @module     format_editortest/local/examples/dinamic/displayer
 * @package    core_course
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {BaseComponent} from 'core/reactive';

export default class Component extends BaseComponent {

    /**
     * Initial state ready method.
     *
     * @param {object} state the initial state
     */
    stateReady() {
        const target = this.getElement(this.selectors.CONTENT);
        target.innerHTML = `Hi, I am the subcomponent and I am ready!`;

        // Just bind a click listener to the component button.
        const button = this.getElement(this.selectors.BOLD);
        this.addEventListener(button, 'click', this._clickHandler);
        button.disabled = false;
    }

    /**
     * Unregister and remove hook method.
     */
    destroy() {
        const target = this.getElement(this.selectors.CONTENT);
        target.innerHTML = `Those are my lasts words. Bye!`;

        // Disable the button.
        this.getElement(this.selectors.BOLD).disabled = true;

        // Note we don't need to remove any event listener because the unregister
        // process executes removeAllEvenetListners for us.
    }

    _clickHandler() {
        const target = this.getElement(this.selectors.CONTENT);
        target.style.fontWeight = target.style.fontWeight ? '' : 'bold';
    }

}