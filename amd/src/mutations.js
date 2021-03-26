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
 * Default mutation manager
 *
 * @module     format_editortest/mutations
 * @package    core_course
 * @copyright  2021 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import courseeditor from 'core_course/courseeditor';
import DefaultMutations from 'core_course/local/courseeditor/mutations';

class Mutations extends DefaultMutations {

    toggleCourseValue(statemanager, key) {
        let state = statemanager.state;
        statemanager.setLocked(false);
        state.course[key] = !state.course[key];
        statemanager.setLocked(true);
    }

    changeCourseValue(statemanager, key, value) {
        let state = statemanager.state;
        statemanager.setLocked(false);
        state.course[key] = value;
        statemanager.setLocked(true);
    }

    changeMyFormat(statemanager, key, value) {
        let state = statemanager.state;
        statemanager.setLocked(false);
        // Only the first two depth levels of our state are reactive. If any mutation
        // wants to modify an depper element, must reassign the variable to trigger
        // the reactive events.
        const myformat = {...state.course.myformat};
        myformat[key] = value;
        state.course.myformat = myformat;
        statemanager.setLocked(true);
    }
}

const init = function() {
    courseeditor.setMutations(new Mutations());
};

export default {init};
