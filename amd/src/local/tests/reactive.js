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
 * Test component.
 *
 * Important note: this is internal testing. Components should never user state manager or
 * reactive module directly. Only reactive instances can do it this way.
 *
 * @module     format_editortest/local/tests/reactive
 * @package    core_course
 * @copyright  2020 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {Reactive} from 'core/reactive';
import TestBase from 'format_editortest/local/tests/testbase';
import log from 'core/log';

class Test extends TestBase {

    /**
     * Function to prepare test scenario.
     */
    setUp() {
        this.eventName = 'reactive_changed';
    }

    /**
     * Auxiliar event dispatch method required by the reactive component..
     *
     * @param {*} detail the detail data
     * @param {*} target the element target
     */
    eventDispatch(detail, target) {
        if (target === undefined) {
            target = document;
        }
        target.dispatchEvent(new CustomEvent('reactive_changed', {
            bubbles: false,
            detail: detail,
        }));
    }

    /**
     * Test the creation of a Reactive module and checks stateReady is called.
     */
    testCreation() {
        const test1 = this.addAssert('Create a new reactive instance');

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
            target: this.target,
            state: {
                tocheck: {value: 'OK'},
            },
            mutations: {},
        });

        reactive.registerComponent({
            stateReady: (state) => {
                this.assertTrue(test1, state.tocheck.value === 'OK');
            }
        });
    }

    /**
     * Check that stateReady is called even if the initial state is set after
     * the component registration.
     */
    testSetInitialState() {
        const test1 = this.addAssert('Initial state after creationt');

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
            target: this.target,
            mutations: {},
        });

        reactive.registerComponent({
            stateReady: (state) => {
                this.assertTrue(test1, state.tocheck.value === 'OK');
            }
        });
        reactive.setInitialState({
            tocheck: {value: 'OK'},
        });
    }

    /**
     * Check that initialState cannot be used when the initial state is passed on creation.
     */
    testSetInitialStateWrong() {

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
            target: this.target,
            state: {
                tocheck: {value: 'OK'},
            },
            mutations: {},
        });

        this.expectException();

        reactive.setInitialState({
            tocheck: {value: 'OK'},
        });
    }

    /**
     * Check that initial state cannot be set twice.
     */
    testSetInitialStateTwice() {

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
            target: this.target,
            mutations: {},
        });

        reactive.setInitialState({
            tocheck: {value: 'OK'},
        });

        this.expectException();

        reactive.setInitialState({
            tocheck: {value: 'OK'},
        });
    }

    /**
     * Check a reactive module can be created without a DOM element.
     */
    testWithoutTarget() {
        const test1 = this.addAssert('Instantiate reactive without a DOM target');

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
            state: {
                tocheck: {value: 'OK'},
            },
            mutations: {},
        });

        reactive.registerComponent({
            stateReady: (state) => {
                this.assertTrue(test1, state.tocheck.value === 'OK');
            }
        });
    }

    /**
     * Check stateReady is called only when the state is really ready.
     */
    testStateReady() {

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
            mutations: {},
        });

        reactive.registerComponent({
            stateReady: (state) => {
                this.assertTrue(test1, state.tocheck.value === 'OK');
            }
        });

        const test1 = this.addAssert('Components stateReady should be called when the state is ready');

        reactive.setInitialState({
            tocheck: {value: 'OK'},
        });
    }

    /**
     * Test mutations.
     */
    testMutations() {
        const test1 = this.addAssert('Call mutations from a component');

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
            state: {
                tocheck: {value: 'OK'},
            },
            mutations: {
                passTest: (statemanager, param1, param2) => {
                    const state = statemanager.state;
                    this.assertTrue(test1, state.tocheck.value === 'OK' && param1 === 'Q' && param2 === true);
                },
            },
        });
        reactive.registerComponent({
            stateReady: () => {
                reactive.dispatch('passTest', 'Q', true);
            },
        });
    }

    /**
     * Test state watchers.
     */
    testWatchers() {
        const test1 = this.addAssert('Test attribute watcher');
        const test2 = this.addAssert('Test general watcher');

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
            state: {
                tocheck: {value: 'OK'},
            },
            mutations: {
                alter: (statemanager, newvalue) => {
                    const state = statemanager.state;
                    statemanager.setReadOnly(false);
                    state.tocheck.value = newvalue;
                    statemanager.setReadOnly(true);
                },
            },
        });

        reactive.registerComponent({
            getWatchers: () => [
                {
                    watch: 'tocheck.value:updated',
                    handler: ({element}) => {
                        this.assertTrue(test1, element.value === 'Perfect');
                    }
                },
                {
                    watch: 'tocheck:updated',
                    handler: ({element}) => {
                        this.assertTrue(test2, element.value === 'Perfect');
                    }
                },
            ],
            stateReady: () => {
                reactive.dispatch('alter', 'Perfect');
            }
        });
    }

    /**
     * Test exceptions when registering a watcher.
     *
     * @param {object} watcher invalid watcher data
     */
    testWrongWatchers(watcher) {

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
        });

        this.expectException();

        reactive.registerComponent({
            getWatchers: () => [watcher],
        });
    }

    dataProviderTestWrongWatchers() {
        return {
            nowatch: {
                handler: () => {
                    return true;
                }
            },
            nohandler: {
                watch: 'tocheck.value:updated',
            },
        };
    }

    /**
     * Test exceptions on mutations.
     */
    testMutationException({mutation}) {
        const test1 = this.addAssert('A mutation throws an exception.');

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
            state: {
                tocheck: {value: 'OK'},
            },
            mutations: {
                somemutation: () => {
                    throw Error('Ups!');
                },
                _privatemethod: () => {
                    this.assertTrue(test1, false);
                },
            },
        });
        reactive.registerComponent({
            stateReady: () => {
                // This function is executed in a promise, we cannot use this.expectException();
                try {
                    reactive.dispatch(mutation, 'Q', true);
                    this.assertTrue(test1, false);
                } catch (error) {
                    this.assertTrue(test1, true);
                }
            },
        });
    }

    /**
     *
     * Data provider for dispatch mutation exceptions.
     *
     * @returns {object} Testing scenarios
     */
    dataProviderTestMutationException() {
        return {
            // Mutations can throw errors.
            throwerror: {
                mutation: 'somemutation',
            },
            // Private methods cannot be dispatched.
            privatemethod: {
                mutation: '_privatemethod',
            },
            // Action names must be strings.
            nonstring: {
                mutation: {name: 'wrong'},
            },
            // Innexistent mutation name.
            innexistentmethod: {
                mutation: 'notTheDroidYouAreLookingFor',
            },
        };
    }

    /**
     * Test add mutations functions.
     */
    testAddMutations() {
        const test1 = this.addAssert('Call an original mutaiton after adding new ones.');
        const test2 = this.addAssert('Call an overridden mutation.');
        const test3 = this.addAssert('Call an added mutation.');

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
            state: {
                tocheck: {value: 'OK'},
            },
            mutations: {
                original: () => {
                    this.assertTrue(test1, true);
                },
                modified: () => {
                    this.assertTrue(test2, false);
                },
            },
        });
        reactive.addMutations({
            modified: () => {
                this.assertTrue(test2, true);
            },
            newmutation: () => {
                this.assertTrue(test3, true);
            },
        });
        reactive.registerComponent({
            stateReady: () => {
                reactive.dispatch('original');
                reactive.dispatch('modified');
                reactive.dispatch('newmutation');
            },
        });
    }

    /**
         * Test set mutations class.
         */
    testSetMutations() {
        const test1 = this.addAssert('Mutation class can be overridden', false);

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
            state: {
                tocheck: {value: 'OK'},
            },
            mutations: {
                alter: () => {
                    this.assertTrue(test1, false);
                },
            },
        });

        // Auxiliar mutation class.
        class NewMutations {

            constructor(test) {
                this.test = test;
            }

            alter(statemanager, testid) {
                this.test.assertTrue(testid, true);
            }
        }

        reactive.setMutations(new NewMutations(this));

        reactive.dispatch('alter', test1);
    }

    /**
     * Test get state.
     */
    testGetState() {
        const test1 = this.addAssert('Call get state');

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
        });
        reactive.setInitialState({
            tocheck: {value: 'OK'},
        });
        this.assertTrue(test1, reactive.state.tocheck.value === 'OK');
    }

    /**
     * Test exceptions when a component tries to modify the state.
     */
    testWriteStateFromComponent() {
        const test1 = this.addAssert('Components cannot write in the state from stateReady.');
        const test2 = this.addAssert('Components cannot write in the state from watchers.');
        const test3 = this.addAssert('Components cannot write in the element from watchers.');

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
            state: {
                tocheck: {value: 'OK'},
            },
            mutations: {
                alter: (statemanager, newvalue) => {
                    const state = statemanager.state;
                    statemanager.setReadOnly(false);
                    state.tocheck.value = newvalue;
                    statemanager.setReadOnly(true);
                },
            },
        });
        reactive.registerComponent({
            getWatchers: () => [
                {
                    watch: 'tocheck:updated',
                    handler: ({state, element}) => {
                        // This function is executed in an event, we cannot use this.expectException();
                        try {
                            state.tocheck.value = 'Nope';
                            this.assertTrue(test2, false);
                        } catch (error) {
                            this.assertTrue(test2, true);
                        }
                        try {
                            element.value = 'Nope';
                            log.debug(element);
                            this.assertTrue(test3, false);
                        } catch (error) {
                            this.assertTrue(test3, true);
                        }
                    }
                },
            ],
            stateReady: (state) => {
                // This function is executed in a promise, we cannot use this.expectException();
                try {
                    state.tocheck.value = 'Nope';
                    this.assertTrue(test1, false);
                } catch (error) {
                    this.assertTrue(test1, true);
                }
                // Change value using mutation.
                reactive.dispatch('alter', 'Perfect');
            },
        });
    }

    /**
     * Test evenet bubbling.
     */
    testEventBubble() {
        const test1 = this.addAssert('General state change triggered.');
        const test2 = this.addAssert('General state change bubbles.', true);
        const test3 = this.addAssert('Private state watcher event trigger.');
        const test4 = this.addAssert('Private state watcher change does not bubble.', true);

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
            mutations: {
                alter: (statemanager, newvalue) => {
                    const state = statemanager.state;
                    statemanager.setReadOnly(false);
                    state.tocheck.value = newvalue;
                    statemanager.setReadOnly(true);
                },
            },
        });
        document.addEventListener('tocheck:updated', () => {
            this.assertTrue(test2, false);
        });
        document.addEventListener('tocheck.value:updated', () => {
            this.assertTrue(test4, false);
        });

        reactive.registerComponent({
            getWatchers: () => [
                {
                    watch: 'tocheck:updated',
                    handler: () => {
                        this.assertTrue(test1, true);
                    }
                },
                {
                    watch: 'tocheck.value:updated',
                    handler: () => {
                        this.assertTrue(test3, true);
                    }
                },
            ],
            stateReady: () => {
                reactive.dispatch('alter', 'Perfect');
            }
        });

        reactive.setInitialState({
            tocheck: {value: 'OK'},
        });
    }

    /**
     * Test reactives instances does not interfere which each other.
     */
    testSimultaneousReactives() {
        const test1 = this.addAssert('Reactive instance 1 execute the correct stateReady.');
        const test2 = this.addAssert('Reactive instance 2 execute the correct stateReady.');
        const test3 = this.addAssert('Watcher 1 works with reactive 1 changes.');
        const test4 = this.addAssert('Watcher 2 ignore reactive 1 changes.', true);
        const test5 = this.addAssert('Watcher 1 ignore reactive 2 changes.', true);
        const test6 = this.addAssert('Watcher 2 works with reactive 2 changes.');

        const reactive1 = new Reactive({
            name: 'TestReactive1',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
            state: {
                tocheck: {value: 'reactive1'},
                tocheck2: {value: 'reactive1'},
            },
            mutations: {
                alter: (statemanager, newvalue) => {
                    const state = statemanager.state;
                    statemanager.setReadOnly(false);
                    state.tocheck.value = newvalue;
                    statemanager.setReadOnly(true);
                },
            },
        });

        const reactive2 = new Reactive({
            name: 'TestReactive2',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
            state: {
                tocheck: {value: 'reactive2'},
                tocheck2: {value: 'reactive2'},
            },
            mutations: {
                alter: (statemanager, newvalue) => {
                    const state = statemanager.state;
                    statemanager.setReadOnly(false);
                    state.tocheck2.value = newvalue;
                    statemanager.setReadOnly(true);
                },
            },
        });

        // Component 1 only change the tocheck value.
        reactive1.registerComponent({
            getWatchers: () => [
                {
                    watch: 'tocheck:updated',
                    handler: ({element}) => {
                        this.assertEquals(test3, 'newreactive1', element.value);
                    }
                },
                {
                    watch: 'tocheck2:updated',
                    handler: () => {
                        this.assertTrue(test5, false);
                    }
                },
            ],
            stateReady: (state) => {
                this.assertEquals(test1, 'reactive1', state.tocheck.value);
                reactive1.dispatch('alter', 'newreactive1');
            },
        });

        // Component 2 only change the tocheck2 value
        reactive2.registerComponent({
            getWatchers: () => [
                {
                    watch: 'tocheck2:updated',
                    handler: ({element}) => {
                        this.assertEquals(test6, 'newreactive2', element.value);
                    }
                },
                {
                    watch: 'tocheck:updated',
                    handler: () => {
                        this.assertTrue(test4, false);
                    }
                },
            ],
            stateReady: (state) => {
                this.assertEquals(test2, 'reactive2', state.tocheck.value);
                reactive2.dispatch('alter', 'newreactive2');
            },
        });
    }

    /**
     * Test register component calls for dispatching registration events.
     *
     * @param {*} an object with:
     * - watchers: the watchers list
     * - correct: if the registering should pass
     * - twice: if the component should be registered twice
     *
     */
    testDispatchRegistration({watchers, correct, twice}) {
        let test1 = this.addAssert('Registration event dispatched.', false);

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
        });

        if (!correct) {
            this.expectException();
        }

        const component = reactive.registerComponent({

            getWatchers: () => {
                return watchers;
            },

            dispatchRegistrationSuccess: () => {
                this.assertTrue(test1, correct);
            },

            dispatchRegistrationFail: () => {
                this.assertTrue(test1, !correct);
            },
        });

        if (twice) {
            // Create a new assert using the same variable to check if it assert a second time.
            test1 = this.addAssert('Registration event dispatched twice.', false);
            reactive.registerComponent(component);
        }


    }

    /**
     * Data provider of testDispatchRegistration.
     *
     * @returns {object} testing scenarios
     */
    dataProviderTestDispatchRegistration() {
        return {
            correct: {watchers: [], correct: true, twice: false},
            correcttwice: {watchers: [], correct: true, twice: true},
            nowatchwatcher: {watchers: [{watch: 'no_handler'}], correct: false, twice: false},
            nowatchwatchertwice: {watchers: [{watch: 'no_handler'}], correct: false, twice: true},
            nohandlewatcher: {watchers: [{watch: () => 'no_watch'}], correct: false, twice: false},
            nohandlewatchertwice: {watchers: [{watch: () => 'no_watch'}], correct: false, twice: true},
        };
    }

    /**
     * Test unregister component.
     */
    testUnregisterComponent() {
        let test1 = this.addAssert('Component is watching the state.', false);
        let test2 = this.addAssert('Unregistered component stop watching the state.', true);

        const reactive = new Reactive({
            name: 'TestReactive',
            eventName: this.eventName,
            eventDispatch: this.eventDispatch,
            state: {
                tocheck: {value1: 'OK', value2: 'OK'},
            },
            mutations: {
                alter: (statemanager, prop, newvalue) => {
                    const state = statemanager.state;
                    statemanager.setReadOnly(false);
                    state.tocheck[prop] = newvalue;
                    statemanager.setReadOnly(true);
                },
            },
        });

        const component = {
            getWatchers: () => [
                {
                    watch: 'tocheck.value1:updated',
                    handler: ({element}) => {
                        this.assertEquals(test1, 'Perfect', element.value1);
                        // Unregister and test.
                        reactive.unregisterComponent(component);
                        reactive.dispatch('alter', 'value2', 'Perfect');
                    }
                },
                {
                    watch: 'tocheck.value2:updated',
                    handler: () => {
                        this.assertTrue(test2, false);
                    }
                },
            ],
            stateReady: () => {
                reactive.dispatch('alter', 'value1', 'Perfect');
            }
        };

        reactive.registerComponent(component);

    }
}

export default new Test();
