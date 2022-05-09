import * as React from 'react';
import {Unit} from '../../Contexts/UnitContext';
import {editUnit} from '../../Services/UnitAPI.js';
import {Error} from '../../Contexts/ErrorContext';
import {Load} from '../../Contexts/LoadContext';

const Editunit = ({setFullMenuVisible, fullMenuVisible}) => {
    const {states:UnitStates} = React.useContext(Unit);
    const {actions:errorActions} = React.useContext(Error);
    const {actions:loadActions} = React.useContext(Load);

    const editUnitFunc = (editUnitData) => {
        loadActions.setLoading(true);
        editUnit(editUnitData)
        .then((res) => {
            if(res.error) {
                errorActions.setError(res.error);
                loadActions.setLoading(false);
            }
        });
        loadActions.setLoading(false);
    }

    return(
        <div>
            <h2>Edit Class</h2>
            <form onSubmit={(e)=>{
                e.preventDefault();
                editUnitFunc({
                    "unit_content": e.target.unit_content.value,
                    "unit_content_type": e.target.unit_content_type.value,
                    "unit_id": UnitStates.currentUnit.unit_id
                });
                setFullMenuVisible(false)
            }}>
                <label>Unit Content</label>
                <input type="text" name="unit_content" placeholder="Class Name" defaultValue={UnitStates.currentUnit.unit_content} required/>
                <label>Unit Content Type</label>
                <textarea name="unit_content_type" placeholder="Class Description" defaultValue={UnitStates.currentUnit.unit_content_type}  required></textarea>
                <input type="submit" ></input>
            </form>
            <button
                onClick={() => setFullMenuVisible(false)}
              >
                Close
            </button>
        </div>
    )
}
export default Editunit;