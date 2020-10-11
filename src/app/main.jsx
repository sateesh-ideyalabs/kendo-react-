import * as React from "react";
import * as ReactDOM from "react-dom";
import {
    Scheduler,
    WeekView,
    MonthView
} from "@progress/kendo-react-scheduler";

import { Dialog, Window } from '@progress/kendo-react-dialogs';

import { Grid, GridColumn } from "@progress/kendo-react-grid";

import gridData from "./data.js";

const imgCell = (props) => {
    return (
        <td>
            <img src={props.dataItem.image} style={{ width: 60, height: 60 }} />
        </td>
    )
};

const App = () => {
    const toggleDialog = () => {
        this.setState({
            visibleDialog: !this.state.visibleDialog
        });
    };

    const toggleWindow= () => {
        this.setState({
            visibleWindow: !this.state.visibleWindow
        });
    };

    const MyScheduler = React.createRef();
    MyScheduler.state = {
        visibleDialog: false,
        visibleWindow: false
    };
    const [data, setData] = React.useState([]);
    const [dragTitle, setDragTitle] = React.useState("");
    const [dragItem, setDragItem] = React.useState("");
    const handleDropItem = e => {
        let start = e.target.getAttribute("data-slot-start");
        let end = e.target.getAttribute("data-slot-end");
        let startDate = new Date(parseInt(start));
        let endDate = new Date(parseInt(end));
        let newEvent = {
            id: dragItem.taskID,
            title: dragItem.title,
            StartTimezone: null,
            start: startDate,
            end: endDate
        };
        setData([newEvent, ...data]);
    };
    React.useEffect(() => {
        let schedulerElement = MyScheduler.current.element;
        schedulerElement.addEventListener("drop", handleDropItem);
        schedulerElement.addEventListener("dragover", e => e.preventDefault());
    });

    const GridRowRender = (tr, props) => {
        const trProps = {
            draggable: true,
            onDragStart: e => {
                setDragItem(props.dataItem);
                toggleDialog();
            }
        };
        return React.cloneElement(tr, { ...trProps }, tr.props.children);
    };
    return (
        <>
            <Grid data={gridData} rowRender={GridRowRender}>
                <GridColumn field='taskID' />
                <GridColumn field='title' />
                <GridColumn field='image' cell={imgCell}   />
                <GridColumn field='start' />
                <GridColumn field='end' />
            </Grid>
            <Scheduler data={data} defaultDate={new Date("2013/6/13")} ref={MyScheduler}>
                <WeekView showWorkHours={false} />
                <MonthView />
            </Scheduler>
            <hr />

            <div>
                {(!this.state.visibleDialog && !this.state.visibleWindow) && (
                    <span>
                        <button className="k-button" onClick={this.toggleDialog}>Open Dialog</button>
                        <button className="k-button" onClick={this.toggleWindow}>Open Window</button>
                    </span>) }
                {this.state.visibleDialog && <Dialog title={"Please confirm"} onClose={this.toggleDialog}>
                    <p style={{ margin: "25px", textAlign: "center" }}>Are you sure you want to continue?</p>
                    <DialogActionsBar>
                        <button className="k-button" onClick={this.toggleDialog}>No</button>
                        <button className="k-button" onClick={this.toggleDialog}>Yes</button>
                    </DialogActionsBar>
                </Dialog>}
                {this.state.visibleWindow && <Window title={"Status"} onClose={this.toggleWindow}>
                    Additional info
                </Window>}
            </div>

        </>
    );
};

ReactDOM.render(<App />, document.querySelector("my-app"));
