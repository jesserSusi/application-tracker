import React from "react";
import ApplicationList from "./components/ApplicationsList";

class ApplicationComponent extends React.Component {
    render() {
        return (
            <div className="main">
                <ApplicationList />
            </div>
        )
    }
}

export default ApplicationComponent;