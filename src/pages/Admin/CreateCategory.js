import React, { useEffect, useState } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import axios from 'axios';
import toast from 'react-hot-toast';
import CategoryForm from '../../components/Form/CategoryForm';
import { Modal } from 'antd'


const CreateCategory = () => {
    const [categories, setcategories] = useState([])
    const [name,setName]=useState("")
    const [visible,setVisible] = useState(false)
    const [selected,setselected]=useState(null)
    const [updateName,setupdateName]=useState("")
    //handle Form
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/category/create-category`,{name})
            if (data?.success) {
                toast.success(`${name} is Created`)
                getAllCategory();
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went Wrong in input form')
        }
    }

    //Get All Category
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/allcategory`)
            if (data.success) {
                setcategories(data.category)
            }
        } catch (error) {
            console.log(error)
            toast.error('Something Went wrong in geting Category')
        }
    }
    useEffect(() => {
        getAllCategory();
    }, [])

    //Update Category
    const handleUpdate= async(e)=>{
        e.preventDefault()
        try {
            const {data}=await axios.put(`${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`,{name:updateName})
            if (data.success) {
                toast.success(`${updateName} is updated`)
                setselected(null);
                setupdateName("");
                setVisible(false);
                getAllCategory();
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Something Went Wrong')
        }
    }

    //Delete Category
    const handleDelete= async(pId)=>{
        try {
            const {data}=await axios.delete(`${process.env.REACT_APP_API}/api/v1/category/delete-category/${pId}`)
            if (data.success) {
                toast.success(`Category is deleted`)
                getAllCategory();
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Something Went Wrong')
        }
    }
    return (
        <Layout title={"Dashboard - Create Category"}>
            <div className="container.fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Manage Category</h1>
                        <div className="p-3 w-50">
                            <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName}/>
                        </div>
                        <div className='w-75'>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>{categories.map(c => (
                                    <> <tr>
                                        <td key={c._id}>{c.name}</td>
                                        <td>
                                            <button className="btn btn-primary mx-2" onClick={()=>{setVisible(true);setupdateName(c.name)
                                            setselected(c)
                                            }} >Edit</button>
                                            <button className="btn btn-danger mx-2" onClick={()=>{handleDelete(c._id)}}>Delete</button>
                                        </td>
                                    </tr>
                                    </>))}
                                </tbody>
                            </table>
                        </div>
                        <Modal onCancel={()=>setVisible(false)}footer={null} visible={visible}>
                            <CategoryForm value={updateName} setValue={setupdateName} handleSubmit={handleUpdate}/>
                        </Modal>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default CreateCategory
