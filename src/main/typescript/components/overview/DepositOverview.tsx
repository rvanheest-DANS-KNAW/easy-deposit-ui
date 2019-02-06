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
import * as React from "react"
import { Component, useEffect } from "react"
import { Action, compose } from "redux"
import { connect } from "react-redux"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { AppState } from "../../model/AppState"
import { Deposit, DepositId, DepositOverviewState, Deposits, DepositState } from "../../model/Deposits"
import { cleanDeposits, deleteDeposit, fetchDeposits } from "../../actions/depositOverviewActions"
import { FetchAction, PromiseAction, ThunkAction } from "../../lib/redux"
import DepositTableHead from "./DepositTableHead"
import DepositTableRow from "./DepositTableRow"
import { Alert, CloseableWarning, ReloadAlert } from "../Errors"
import { depositFormRoute } from "../../constants/clientRoutes"
import EmptyDepositTableRow from "./EmptyDepositTableRow"

function isEditable({ state }: Deposit): boolean {
    return state === DepositState.DRAFT || state === DepositState.REJECTED
}

interface DepositOverviewProps extends RouteComponentProps<{}> {
    deposits: DepositOverviewState

    fetchDeposits: () => ThunkAction<FetchAction<Deposits>>
    cleanDeposits: () => Action
    deleteDeposit: (depositId: DepositId) => ThunkAction<PromiseAction<void>>
}

const DepositOverview = (props: DepositOverviewProps) => {
    useEffect(() => {
        props.fetchDeposits()
        return function cleanup() {
            props.cleanDeposits()
        }
    }, [])

    const renderLoadingError = () => props.deposits.loading.loadingError && (
        <ReloadAlert key="loadingError"
                     reload={props.fetchDeposits}>
            An error occurred: {props.deposits.loading.loadingError}. Cannot load data from the server.
        </ReloadAlert>
    )

    const renderDeleteError = () => {
        return Object.keys(props.deposits.deleting)
            .map(depositId => {
                const { deleteError } = props.deposits.deleting[depositId]

                if (deleteError) {
                    const deposit = props.deposits.deposits[depositId]
                    const errorText = deposit
                        ? `Cannot delete deposit '${deposit.title}'. An error occurred: ${deleteError}.`
                        : `Cannot delete a deposit. An error occurred: ${deleteError}.`

                    return <CloseableWarning key={`deleteError.${depositId}`}>{errorText}</CloseableWarning>
                }
            })
    }

    const renderCreateNewError = () => props.deposits.creatingNew.createError && (
        <Alert key="createNewError">
            An error occurred: {props.deposits.creatingNew.createError}. Cannot create a new dataset. Please try again.
        </Alert>
    )

    const renderAlerts = () => [
        renderLoadingError(),
        renderDeleteError(),
        renderCreateNewError(),
    ]

    const renderTable = () => {
        const depositIds = Object.keys(props.deposits.deposits)

        return (
            <table className="table table-striped deposit_table">
                <DepositTableHead/>
                <tbody>{depositIds.length == 0
                    ? <EmptyDepositTableRow/>
                    : depositIds.map(depositId => {
                        const editable = isEditable(props.deposits.deposits[depositId])
                        return <DepositTableRow key={depositId}
                                                deposit={props.deposits.deposits[depositId]}
                                                deleting={props.deposits.deleting[depositId]}
                                                deleteDeposit={e => { e.stopPropagation(); props.deleteDeposit(depositId) }}
                                                editable={editable}
                                                enterDeposit={() => editable && props.history.push(depositFormRoute(depositId))}/>
                    })}</tbody>
            </table>
        )
    }

    return (
        <>
            {renderAlerts()}
            {props.deposits.loading.loading && <p>loading data...</p>}
            {props.deposits.loading.loaded && renderTable()}
        </>
    )
}

const mapStateToProps = (state: AppState) => ({
    deposits: state.deposits,
})

export default compose(
    withRouter,
    connect(mapStateToProps, { fetchDeposits, cleanDeposits, deleteDeposit }),
)(DepositOverview)
