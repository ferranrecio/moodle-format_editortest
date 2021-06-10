<?php
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
 * Contains the ajax update course structure.
 *
 * @package   core_course
 * @copyright 2021 Ferran Recio <ferran@moodle.com>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace format_editortest\output\courseformat\state;

use core_course\course_format;
use core_courseformat\output\local\state\course as statecourse;
use stdClass;
use renderer_base;

class course extends statecourse {

    /** @var course_format the course format class */
    protected $format;

    /**
     * Export this data so it can be used as state object in the course editor.
     *
     * @param renderer_base $output typically, the renderer that's calling this function
     * @return stdClass data context for a mustache template
     */
    public function export_for_template(renderer_base $output): stdClass {

        $data = parent::export_for_template($output);

        $data->textvalue = 'Plugin value';
        // Variable used in some components.
        $data->sampletext = 'This is a state value.';
        // Variables used for the watcher example.
        $data->samplebool = false;
        // Variable used for lazy load examples.
        $data->lazytext = 'This is a lazy text from the state';
        // Variables for subcomponents examples.
        $data->samplestring1 = '';
        $data->samplestring2 = 'Some initial value';
        $data->samplestring3 = 'Another initial value';
        // Variables for the subcomponents example.
        $data->myformat = (object)[
            'bold' => false,
            'color' => 0,
            'colors' => [
                '#000000',
                '#FF0000',
                '#00FF00',
                '#0000FF',
                '#00FFFF',
                '#FFFF00',
            ],
        ];

        return $data;
    }
}
