export function getStateFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem('state');

        if (serializedState === null) {
            return undefined;
        }
        console.log(serializedState);
        return JSON.parse(serializedState);
    }
    catch(e) {
        console.log(e);
        return ;
    }
}
