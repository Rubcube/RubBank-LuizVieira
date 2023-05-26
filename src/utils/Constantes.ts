export const regex = {
    fullName: /^[[a-zA-Z\u00C0-\u00FF ]{3,}(?: [a-zA-Z\u00C0-\u00FF ]+){1,}$/,
    phone: /^\(?\d{2}\)?\s?\d{4,5}\-?\d{4}$/,
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[^\s]).{8,}$/,
    transactionPassword: /\d\d\d\d$/,
    replace: /[^\d]+/g
}

export const take: number = 10;

