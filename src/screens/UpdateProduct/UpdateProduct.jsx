import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgCoverFile, setImgCoverFile] = useState(null);
  const [imagesFiles, setImagesFiles] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://project-model.onrender.com/api/v1/product", {
        headers: { token: token },
      });

      if (response.data && Array.isArray(response.data.product)) {
        setProducts(response.data.product);
      } else {
        console.error("Products data not found or is not an array:", response.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("An error occurred while fetching products."); // Generic error message
    }
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setImgCoverFile(null);
    setImagesFiles([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`https://project-model.onrender.com/api/v1/product/${productId}`, {
        headers: { token: token },
      });
      setProducts(products.filter(product => product.id !== productId));
      toast.success("Product deleted successfully."); // Generic success message
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("An error occurred while deleting the product."); // Generic error message
    }
  };

  const handleSave = async () => {
    if (!selectedProduct) return;

    const formData = new FormData();

    try {
      formData.append("title", selectedProduct.title);
      formData.append("quantity", selectedProduct.quantity);
      formData.append("price", selectedProduct.price);
      formData.append("description", selectedProduct.description);
      
      if (imgCoverFile) {
        formData.append("imgCover", imgCoverFile);
      }

      imagesFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.put(`https://project-model.onrender.com/api/v1/product/${selectedProduct.id}`, formData, {
        headers: {
          token: token,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.error) {
        console.error("Update error details:", response.data.error);
        toast.error("An error occurred while updating the product."); // Generic error message
      } else {
        setIsModalOpen(false);
        fetchProducts(); 
        toast.success("Product updated successfully."); // Generic success message
      }
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("An error occurred while updating the product."); // Generic error message
    }
  };

  return (
    <div className="container">
      <h1 className="py-2">Update Products</h1>
      
      {products.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
                <td>{product.description}</td>
                <td className="d-inline-flex">
                  <button onClick={() => handleUpdate(product)} className="btn btn-primary m-1">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="btn btn-danger m-1">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products available.</p>
      )}

      {isModalOpen && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button type="button" className="close btn btn-danger m-1" onClick={() => setIsModalOpen(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Title:</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={selectedProduct?.title || ''} 
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, title: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label>Quantity:</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={selectedProduct?.quantity || ''} 
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label>Price:</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={selectedProduct?.price || ''} 
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea 
                    className="form-control" 
                    value={selectedProduct?.description || ''} 
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label>Img Cover:</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    onChange={(e) => setImgCoverFile(e.target.files[0])} 
                  />
                </div>
                <div className="form-group">
                  <label>Images:</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    multiple 
                    onChange={(e) => setImagesFiles(Array.from(e.target.files))} 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={handleSave} className="btn btn-success">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default UpdateProduct;
