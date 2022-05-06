import * as React from 'react';
import {Error} from './ErrorContext';
import {Load} from './LoadContext';
import {findByLesson, createUnit} from '../Services/UnitAPI';
import {User} from './UserContext';

export const Unit = React.createContext();

const UnitContext = ({children}) => {
    const {actions:errorActions} = React.useContext(Error);
    const {actions:loadActions} = React.useContext(Load);
    const {states:userStates} = React.useContext(User);
    const [lesson_id, setLessonId] = React.useState("");
    const setLoading = loadActions.setLoading;
    const setError = errorActions.setError;
    const [unitData, setUnitData] = React.useState(null);
    const [createUnitData, setCreateUnitData] = React.useState(null);

    React.useEffect(() => {
        if(userStates.loggedout) setUnitData(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userStates.loggedout]);

    React.useEffect(() => {
        if(createUnitData){
            setLoading(true);
            createUnit(createUnitData).then(unitData => {
                localStorage.setItem('unit', JSON.stringify(unitData));
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                setError(err);
            })
            .finally(() => {
                setLoading(false)
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createUnitData]);

    React.useEffect(() => {
        const storage = localStorage.getItem("unit");
        if(storage){
            const parsedStorage = JSON.parse(storage);
            setUnitData(parsedStorage);
        }
    } , []);

    React.useEffect(() => {
        if(lesson_id){
            setLoading(true);
            findByLesson(lesson_id).then(unitData => {
                localStorage.setItem('unit', JSON.stringify(unitData));
                setUnitData(unitData);
            })
            .catch(err => {
                setError(err);
            }).finally(() => {
                setLoading(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lesson_id]);

    return(
        <Unit.Provider value={{
            states: {
                unitData: unitData,
                lesson_id: lesson_id,
                createUnitData: createUnitData,
            },
            actions: {
                setUnitData: setUnitData,
                setLessonId: setLessonId,
                setCreateUnitData: setCreateUnitData,
            }
        }}>
            {children}
        </Unit.Provider>
    );
}
export default UnitContext;