import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [],
    authuser: [],
    tickets: [],
    alltickets: [],
    formDataRegister: {
        firstName: '',
        lastName: '',
        email: '',
        sex: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'user',
    },
    formDataTicket: {
        email: '',
        title: '',
        description: '',
        status: 'Open',
    },
    image: null,
    errorsRegister: {},
    errorscreateticket: {}
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        getauthUser: (state, action) => {
            const user = action.payload;
            state.authuser = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                sex: user.sex,
                role: user.role,
                phone: user.phone,
                profileImage: user.profileImage,
            };
        },

        getUser: (state, action) => {
            state.users = action.payload.map((user) => ({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                sex: user.sex,
                role: user.role,
                phone: user.phone,
                profileImage: user.profileImage,
            }));
        },

        // getAllTicket: (state, action) => {
        //     state.alltickets = action.payload.map((allticket) => ({
        //         id: allticket._id,
        //         title: allticket.title,
        //         description: allticket.description,
        //         status: allticket.status,
        //         user: allticket.user 
        //     }));
        // },

        getAllTicket: (state, action) => {
            state.alltickets = action.payload.map((allticket) => ({
                id: allticket._id,
                title: allticket.title,
                description: allticket.description,
                status: allticket.status,
                user: allticket.user_id ? {  
                    id: allticket.user_id._id,
                    firstName: allticket.user_id.firstName,
                    lastName: allticket.user_id.lastName,
                    email: allticket.user_id.email,
                    profileImage: allticket.user_id.profileImage
                } : null
            }));
        },


        getUserTicket: (state, action) => {
            state.tickets = action.payload.map((ticket) => ({
                id: ticket._id,
                title: ticket.title,
                description: ticket.description,
                status: ticket.status,
            }));
        },

        updateTicketForm: (state, action) => {
            state.formDataTicket[action.payload.field] = action.payload.value;
        },

        clearTicketForm: (state) => {
            state.formDataTicket = {
                email: '',
                title: '',
                description: '',
                status: 'Open',
            };
        },

        deleteUser: (state, action) => {
            const id = action.payload.id;
            state.users = state.users.filter(u => u.id !== id)
        },

        deleteTicket: (state, action) => {
            const id = action.payload.id;
            state.tickets = state.users.filter(u => u.id !== id)
        },

        updateFormData: (state, action) => {
            state.formDataRegister[action.payload.field] = action.payload.value;
        },

        updateImage: (state, action) => {
            state.image = action.payload;
        },

        clearErrors: (state) => {
            state.errorsRegister = {};
        },

        clearErrorsTicket: (state) => {
            state.errorscreateticket = {};
        },

        setErrors: (state, action) => {
            state.errorsRegister = action.payload;
        },


        setErrorsCreateTicket: (state, action) => {
            state.errorscreateticket = action.payload;
        },

    },
});

export const {
    getUser, getauthUser, getAllTicket, getUserTicket, updateFormData,
    updateImage, clearErrors, setErrors, setErrorsCreateTicket,
    deleteUser, deleteTicket, updateTicketForm, clearTicketForm, clearErrorsTicket
} = userSlice.actions;

export default userSlice.reducer;
