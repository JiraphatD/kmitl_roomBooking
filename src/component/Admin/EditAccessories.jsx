import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'

function EditAccessories({ showDialog, setShowDialog, dataToDialog, handleAccessory }) {
    const [dataToSend, setDataToSend] = useState(dataToDialog);
    const [noInput, setNoInput] = useState({ error: false, text: '' })
    const [numberEmpty, setNumberEmpty] = useState(false);
    const handleEditChange = (e) => {
        if (!dataToSend.name) {
            setNoInput({ error: false, text: 'Your accessory...' })
        }
        if (!dataToSend.quantity) {
            setNumberEmpty(false);
        }
        if (e.target.value > 100) {
            return;
        }
        else if (e.target.value < 1) {
            e.target.value = null;
        }
        setDataToSend({
            ...dataToSend,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmitAccs = () => {
        if (!dataToSend.name) {
            setNoInput({ error: true, text: 'Please fill out this field...' })
        }
        else if (!dataToSend.quantity) {
            setNumberEmpty(true);
        }
        else {
            handleAccessory(dataToSend);
            setShowDialog(!showDialog);
            console.log(dataToSend);
        }
    }
    useEffect(() => {
        setDataToSend(dataToDialog);
    }, [dataToDialog]);
    return (
        <Dialog open={showDialog} onClose={() => setShowDialog(!showDialog)}>
            <DialogTitle>{dataToSend.id ? 'EDITING' : 'ADDING'} {dataToSend.name}</DialogTitle>
            <DialogContent>
                <TextField
                    name='name'
                    label='Accessory Name'
                    value={dataToSend.name}
                    onChange={handleEditChange}
                    required
                    sx={{ margin: '5px' }}
                    error={noInput.error}
                    placeholder={noInput.text}
                />
                <TextField
                    name='quantity'
                    label='Accessory Quantity'
                    type='number'
                    inputProps={{ min: 1, max: 100 }}
                    value={dataToSend.quantity}
                    onChange={handleEditChange}
                    required
                    sx={{ margin: '5px' }}
                    error={numberEmpty}
                />
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={() => setShowDialog(!showDialog)}>Cancel</Button>
                <Button variant='contained' onClick={() => handleSubmitAccs()}>{dataToSend.id ? 'EDIT' : 'ADD'}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditAccessories
