interface customErrors{
    invalidCPF: string;
}

interface invalidLengthErrors{
    cep: string;
    street: string;
    state: string;
    phone: string;
    cpf: string;
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
        cpf: "CPF precisa conter pelo menos 11 caracteres"
    },
    custom: {
        invalidCPF: "CPF Inválido"
    },
    invalid_type: "Tipo de dado Inválido",
    default: "Campo Inválido"
});

interface ErrorEnum{
    ONBOARDING_FAILED: object;
    BAD_CREDENTIALS: object;
    USER_NOT_FIND: object;
    TOKEN_ERROR: object;
    TOKEN_AUTH_ERROR: object;
}

export const InternalErrors: ErrorEnum = ({
    ONBOARDING_FAILED : ({code: "onboarding_failed", message: "Falha ao criar usuário"}),
    BAD_CREDENTIALS: ({code: "bad_credentials", message: "Credenciais inválidas"}),
    USER_NOT_FIND: ({code: "user_not_find", message: "Usuário não encontrado"}),
    TOKEN_ERROR: ({code: "token_error", message: "Token de autenticação não encontrado"}),
    TOKEN_AUTH_ERROR: ({code: "token_auth_error", message: "Falha ao autenticar token"}),
})
    
      