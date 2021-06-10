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
 * Topics course format. Display the whole course as "editortest" made of modules.
 *
 * @package format_editortest
 * @copyright 2021 Ferran Recio <ferran@moodle.com>
 * @author N.D.Freear@open.ac.uk, and others.
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

use format_editortest\output\examples;
use format_editortest\output\workbench;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir.'/filelib.php');
require_once($CFG->libdir.'/completionlib.php');

// User can choose between see the JS tests or the component examples.
$display = optional_param('show', 'tests', PARAM_ALPHA);

// TODO: add some minimal activities to the section zero.

// Retrieve course format option fields and add them to the $course object.
$format = course_get_format($course);
$course = $format->get_course();
$context = context_course::instance($course->id);

if (($marker >= 0) && has_capability('moodle/course:setcurrentsection', $context) && confirm_sesskey()) {
    $course->marker = $marker;
    course_set_marker($course->id, $marker);
}

// Make sure section 0 is created.
course_create_sections_if_missing($course, 0);

$renderer = $PAGE->get_renderer('format_editortest');

switch ($display) {
    case 'examples':
        $widget = new examples($format);
        break;

    case 'workbench':
        $widget = new workbench($format);
        break;

    default:
        if (!empty($displaysection)) {
            $format->set_section_number($displaysection);
        }
        $outputclass = $format->get_output_classname('content');
        $widget = new $outputclass($format);
}

echo $renderer->render($widget);
