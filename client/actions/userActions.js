const SET_USER = "SET_USER";

export function setUser(user)
{
    dispatch({
        type: SET_USER,
        user
    })
}
