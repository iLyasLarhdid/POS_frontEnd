import React, { useState } from 'react';
import { Image, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { Button, Card, CardContent, Modal } from '@mui/material';
import config from 'config';


const ProductPictureUpload = ({product, fileList, setFileList})=>{
    
    //get the id from index page and retrieve data based on it
    const [profileData,] = useState();
    const [allowUpload, setAllowUpload] = useState(true);
    const [preview, setPreview] = useState({previewImage:'',previewVisible: false,previewTitle: ''});

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        console.log("file list");
        console.log(fileList);
      };

    function getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    }
    const handleCancel = () => setPreview({ ...preview, previewVisible: false });
    const onPreview = async file => {
        console.log(file);
        console.log(preview);
        let src = file.url;
        if (!src) {
          file.preview = await getBase64(file.originFileObj);
        }
        setPreview({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
          });
      };

    console.log("inside profile details and the data is :",profileData);
    return(
    <div className="container">
    <div className="row">
    <Card>
        <CardContent>
            <div className="col-12 col-md-3 col-lg-4 col-xl-3" style={{ borderRadius:"10px", padding:"1rem",marginBottom:"1rem"}}>
                {(product === null || !allowUpload  ) ? 
                    <>  
                        <ImgCrop rotate>
                        <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}
                            onPreview={onPreview}
                            style={{ width:"250" }}
                        >
                            {fileList.length <= 5 && '+ Upload'}
                        </Upload>
                        </ImgCrop>
                        <Button
                                fullWidth
                                type="primary"
                                style={{ marginTop: 16 }}
                                onClick={()=>{setAllowUpload(!allowUpload);setFileList([])}}
                                >
                                Cancel
                        </Button>

                        <Modal
                        visible={preview.previewVisible}
                        title={preview.previewTitle}
                        footer={null}
                        onCancel={handleCancel}
                        >
                        <img alt="example" style={{ width: '100%' }} src={preview.previewImage} />
                        </Modal>
                    </>
                :
                    product && product.pictures.map(pic=>{
                        return (
                            <Image src={`${config.host}/upload/viewFile/${pic.title}`} width="50%"/>
                        );
                    })
                }
                {(product !== null || !allowUpload  ) && 
                    <Button
                        fullWidth
                        type="primary"
                        style={{ marginTop: 16 }}
                        onClick={()=>{setAllowUpload(!allowUpload);setFileList([])}}
                    >
                        change pictures
                    </Button>
                    
                }
            </div>
        </CardContent>
    </Card>
        
    </div>
    </div>)
}   

export default ProductPictureUpload;