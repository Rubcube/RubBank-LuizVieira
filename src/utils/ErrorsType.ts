interface customErrors{
    invalidCPF: string;
}

interface invalidLengthErrors{
    cep: string;
    street: string;
    state: string;
    phone: string;
    cpf: string;
    value: string;
}

interface invalidStringErrors{
    default: string;
    password: string;
    transaction_password: string;
}

interface zodErrorsType{
    invalid_string: invalidStringErrors;
    invalid_length: invalidLengthErrors;
    custom: customErrors;
    invalid_type: string;
    default: string;
}


export const ErrorsMessage: zodErrorsType = ({
    invalid_string: {
        default: "Formato do valor inválido",
        password: "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um caractere especial, um número e no mínimo 8 caracteres",
        transaction_password: "A senha transacional deve ser composta por 4 digitos numéricos"
    },
    invalid_length: {
        cep: "CEP precisa conter pelo menos 8 carcteres",
        street: "Nome da rua muito curto",
        state: "UF precisa conter exatamente 2 caracteres",
        phone: "Número de telefone precisa ter pelo menos 11 caracteres",
        cpf: "CPF precisa conter pelo menos 11 caracteres",
        value: "O valor da transação deve ser superior à 5 centavos"
    },
    custom: {
        invalidCPF: "CPF Inválido"
    },
    invalid_type: "Tipo de dado Inválido",
    default: "Campo Inválido"
});

interface CustomErrorType{
    code: string,
    message: string
}

interface InternalErrorsType{
    ONBOARDING_FAILED:     CustomErrorType,
    BAD_CREDENTIALS:       CustomErrorType,
    USER_NOT_FOUND:        CustomErrorType,
    TOKEN_ERROR:           CustomErrorType,
    TOKEN_AUTH_ERROR:      CustomErrorType,
    ACCESS_DENIED:         CustomErrorType,
    PARAMS_NOT_DEFINED:    CustomErrorType,
    ACCOUNT_NOT_FOUND:     CustomErrorType,
    ACCOUNT_STATUS_ERROR:  CustomErrorType,
    WRONG_PASSWORD:        CustomErrorType,
    INVALID_BALANCE:       CustomErrorType,
    TRANSACTION_FAILED:    CustomErrorType,
    INVALID_DATE:          CustomErrorType,
    TRANSACTION_DENIED:    CustomErrorType,
    TRANSACTION_NOT_FOUND: CustomErrorType,
    ADDRESS_NOT_FOUND:     CustomErrorType,
    INTERNAL_ERROR:        CustomErrorType,
    TICKET_NOT_FOUND:      CustomErrorType,
    INVALID_PARAMS:        CustomErrorType
}

export const InternalErrors: InternalErrorsType = {
    ONBOARDING_FAILED:       ({code: "onboarding_failed",     message: "Falha ao criar usuário"}),
    BAD_CREDENTIALS:         ({code: "bad_credentials",       message: "Credenciais inválidas"}),
    USER_NOT_FOUND:          ({code: "user_not_found",        message: "Usuário não encontrado"}),
    TOKEN_ERROR:             ({code: "token_error",           message: "Token de autenticação não encontrado ou expirado"}),
    TOKEN_AUTH_ERROR:        ({code: "token_auth_error",      message: "Falha ao autenticar token"}),
    ACCESS_DENIED:           ({code: "access_denied",         message: "Acesso negado"}),
    PARAMS_NOT_DEFINED:      ({code: "params_not_define",     message: "Parâmetro necessário não definido"}),
    ACCOUNT_NOT_FOUND:       ({code: "account_not_found",     message: "Conta não encontrada"}),
    ACCOUNT_STATUS_ERROR:    ({code: "account_status_error",  message: "Conta Inativa ou Bloqueada"}),
    WRONG_PASSWORD:          ({code: "wrong_password",        message: "Senha incorreta"}),
    INVALID_BALANCE:         ({code: "invalid_balance",       message: "Saldo insuficiente"}),
    TRANSACTION_FAILED:      ({code: "transaction_failed",    message: "Falha ao tentar realizar a transação"}),
    INVALID_DATE:            ({code: "invalid_date",          message: "Data inválida"}),
    TRANSACTION_DENIED:      ({code: "transaction_denied",    message: "Transação negada"}),
    TRANSACTION_NOT_FOUND:   ({code: "transaction_not_found", message: "Transação não encontrada"}),
    ADDRESS_NOT_FOUND:       ({code: "address_not_found",     message: "Endereço não encontrado"}),
    INTERNAL_ERROR:          ({code: "internal_error",        message: "Erro interno ao processar requisição"}),
    TICKET_NOT_FOUND:        ({code: "ticket_not_found",      message: "Ticket de suporte não encontrado"}),
    INVALID_PARAMS:          ({code: "invalid_params",        message: "Parâmetros inválido"})
}

export default class CustomError{

    error: CustomErrorType;

    constructor(error: CustomErrorType){
        this.error = error;
    }
}