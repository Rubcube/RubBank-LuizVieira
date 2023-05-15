export const fullNameRegex = /^[[a-zA-Z\u00C0-\u00FF ]{3,}(?: [a-zA-Z\u00C0-\u00FF ]+){1,}$/;
export const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}\-?\d{4}$/;
export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[^\s]).{8,}$/;
export const transactionPasswordRegex = /\d\d\d\d$/;
export const replaceRegex = /[^\d]+/g;