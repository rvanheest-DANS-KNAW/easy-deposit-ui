/*
 * Copyright (C) 2018 DANS - Data Archiving and Networked Services (info@dans.knaw.nl)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { expect } from "chai"
import { describe, it } from "mocha"
import { UserDetails } from "../../../../main/typescript/model/UserDetails"
import { userConverter } from "../../../../main/typescript/lib/user/user"

describe("user", () => {

    describe("userConverter", () => {

        it("should convert a full input to a UserDetails object", () => {
            const input = {
                username: "user001",
                firstName: "First",
                prefix: "the",
                lastName: "Name",
                displayName: "First a Name",
            }
            const expected: UserDetails = {
                username: "user001",
                firstName: "First",
                prefix: "the",
                lastName: "Name",
                displayName: "First a Name",
            }

            expect(userConverter(input)).to.eql(expected)
        })

        it("should provide defaults for undefined fields", () => {
            const input = {
                username: undefined,
                firstName: undefined,
                prefix: undefined,
                lastName: undefined,
            }
            const expected: UserDetails = {
                username: "",
                firstName: "",
                prefix: "",
                lastName: "",
                displayName: "",
            }

            expect(userConverter(input)).to.eql(expected)
        })

        it("should format the displayName properly when firstName is not given", () => {
            const input = {
                username: "user001",
                firstName: "",
                prefix: "the",
                lastName: "Name",
                displayName: "a Name",
            }
            const expected: UserDetails = {
                username: "user001",
                firstName: "",
                prefix: "the",
                lastName: "Name",
                displayName: "a Name",
            }

            expect(userConverter(input)).to.eql(expected)
        })

        it("should format the displayName properly when prefix is not given", () => {
            const input = {
                username: "user001",
                firstName: "First",
                prefix: undefined,
                lastName: "Name",
                displayName: "First Name",
            }
            const expected: UserDetails = {
                username: "user001",
                firstName: "First",
                prefix: "",
                lastName: "Name",
                displayName: "First Name",
            }

            expect(userConverter(input)).to.eql(expected)
        })

        it("should format the displayName properly when lastName is not given", () => {
            const input = {
                username: "user001",
                firstName: "First",
                prefix: "the",
                lastName: undefined,
                displayName: "a First",
            }
            const expected: UserDetails = {
                username: "user001",
                firstName: "First",
                prefix: "the",
                lastName: "",
                displayName: "a First",
            }

            expect(userConverter(input)).to.eql(expected)
        })
    })
})
