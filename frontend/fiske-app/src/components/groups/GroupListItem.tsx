import React from "react";
import { ReactNode , useState} from "react";
import { useUser } from "../../context/UserContext.tsx";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";

function GroupListItem({group}): ReactNode {

    return (
        <div style={{border:'1px solid black'}}>
            <Link to={`/groups/${group.id}`}><h6>{group.name}</h6></Link>
        </div>
    );
}

export default GroupListItem;