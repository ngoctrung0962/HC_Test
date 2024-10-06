type ITask = {
    id:string,
    name:string,
    status:boolean
}

type IStateFormTask = {
    open:boolean,
    type: "edit" | "add",
    dataEdit: ITask | null
}

export  {
    type ITask,
    type IStateFormTask
}