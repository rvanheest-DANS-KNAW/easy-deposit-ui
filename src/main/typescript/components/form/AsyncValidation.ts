import { Dispatch } from "redux"
import axios from "axios"
import { DepositFormMetadata } from "./parts"
import { Contributor } from "../../lib/metadata/Contributor"
import { SchemedValue } from "../../lib/metadata/Value"
import { ContributorIdDropdownListEntry } from "../../model/DropdownLists"
import { recursiveIsEmpty } from "../../lib/metadata/misc"

async function checkOrcidOnline(url: string): Promise<SchemedValue> {
    try {
        const response = await axios.get(url, {
            headers: { "Accept": "application/json" },
        })
        return Number(response.data["num-found"]) == 0
            ? { value: "Unknown ORCID identifier" }
            : {}
    } catch (e) {
        console.error(`ORCID did not respond well to request "${url}"; not able to validate`, e)
        return {}
    }
}

async function validateSchemedValue(choices: ContributorIdDropdownListEntry[], scheme: string, value: string): Promise<SchemedValue> {
    const entry = choices.find(({ key }) => key === scheme)
    if (entry && entry.key === "id-type:ORCID" && entry.baseURL)
        return await checkOrcidOnline(entry.baseURL.replace("%s", value))
    else
        return {}
}

async function validateContributorIdentifier(choices: ContributorIdDropdownListEntry[], prevContributorErrors: Contributor[], contributors: Contributor[], contributorIndex: number, idIndex: number): Promise<Contributor[]> {
    const contributorIds = contributors[contributorIndex].ids
    if (contributorIds) {
        const schemedValue: SchemedValue = contributorIds[idIndex]

        if (schemedValue.scheme && schemedValue.value) {
            const idErrors = prevContributorErrors[contributorIndex]
                ? (prevContributorErrors[contributorIndex].ids || [])
                : []
            idErrors[idIndex] = await validateSchemedValue(choices, schemedValue.scheme, schemedValue.value)

            prevContributorErrors[contributorIndex] = { ...prevContributorErrors[contributorIndex], ids: idErrors }
        }
    }

    return prevContributorErrors
}

export async function asyncFormValidate(values: DepositFormMetadata, dispatch: Dispatch<any>, props: any, blurredField: string): Promise<any> {
    console.log("asyncFormValidate", values, props, blurredField)

    if (!blurredField) {
        const error = {
            contributors: [
                {
                    ids: {
                        value: "invalid value!!!",
                    },
                },
            ],
        }
        console.log("error", error)
        throw error
    }

    const prevErrors = props.asyncErrors || {}

    const contributorIdsSettings = props.dropDowns.contributorIds.state.fetchedList
        ? props.dropDowns.contributorIds.list
        : []

    let errors: any

    const contributorsIds = /^contributors\[(\d+)]\.ids\[(\d+)]\.(scheme|value)$/.exec(blurredField)
    const rightsHoldersIds = /^rightsHolders\[(\d+)]\.ids\[(\d+)]\.(scheme|value)$/.exec(blurredField)

    if (contributorsIds && contributorsIds.length == 4) {
        const contributorIndex = Number(contributorsIds[1])
        const idIndex = Number(contributorsIds[2])
        const contributorErrors = await validateContributorIdentifier(contributorIdsSettings, prevErrors.contributors || [], values.contributors || [], contributorIndex, idIndex)
        errors = { ...prevErrors, contributors: contributorErrors }
    }
    else if (rightsHoldersIds && rightsHoldersIds.length == 4) {
        const rightsholderIndex = Number(rightsHoldersIds[1])
        const idIndex = Number(rightsHoldersIds[2])
        const rightsHolders = await validateContributorIdentifier(contributorIdsSettings, prevErrors.rightsHolders || [], values.rightsHolders || [], rightsholderIndex, idIndex)
        errors = { ...prevErrors, rightsHolders: rightsHolders }
    }
    else {
        errors = prevErrors
    }

    console.log("errors", errors)

    if (recursiveIsEmpty(errors))
        return errors
    else
        throw errors
}
