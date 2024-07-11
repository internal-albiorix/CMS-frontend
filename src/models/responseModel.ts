export interface responseSelectDataModel {
    success: boolean,
    message: string,
    statusCode: number,
    data: []
}

export interface responsePostDataModel {
    success: boolean,
    message: string,
    statusCode: number,
    data: object
}