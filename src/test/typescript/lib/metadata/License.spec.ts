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
import "mocha"
import { DropdownListEntry } from "../../../../main/typescript/model/DropdownLists"
import { licenseConverter, licenseDeconverter } from "../../../../main/typescript/lib/metadata/License"

describe("License", () => {

    const licenses: DropdownListEntry[] = [
        {
            key: "http://creativecommons.org/publicdomain/zero/1.0",
            value: "CC0-1.0",
            displayValue: "CC0-1.0",
        },
        {
            key: "deu",
            value: "German",
            displayValue: "German",
        },
    ]

    describe("licenseConverter", () => {

        it("should convert a valid license object and extract the license key", () => {
            const input = "http://creativecommons.org/publicdomain/zero/1.0"
            const expected = "http://creativecommons.org/publicdomain/zero/1.0"
            expect(licenseConverter(licenses)(input)).to.eql(expected)
        })

        it("should fail when then license is unknown", () => {
            const input = "invalid license"
            expect(() => licenseConverter(licenses)(input)).to
                .throw("Error in metadata: no such license: 'invalid license'")
        })
    })

    describe("licenseDeconverter", () => {

        it("should convert a license to the correct external model", () => {
            const input = "http://creativecommons.org/publicdomain/zero/1.0"
            const expected = "http://creativecommons.org/publicdomain/zero/1.0"
            expect(licenseDeconverter(licenses)(input)).to.eql(expected)
        })

        it("should fail when the license is unknown", () => {
            const input = "invalid license"
            expect(() => licenseDeconverter(licenses)(input)).to
                .throw("Error in metadata: no such license: 'invalid license'")
        })
    })
})
