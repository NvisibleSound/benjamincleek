
import React, { useState, useRef } from 'react'
// import UploadModal from '../modals/x-UploadModal'
// import UploadToast from '../toasts/UploadToast'
import styles from './uploadForm.module.css'
import { useNavigate, Link, BrowserRouter as Router } from 'react-router-dom';

const UploadIcon = () => {
	const [UploadState, setState] = useState({
		modal: false,
		toast: ''
	  })
	
	const handleModal = () =>
	setState({ ...UploadState, modal: !UploadState.modal })
		return (
			<div className={styles.uploadButton}>
				<div onClick={handleModal} >
					<button>
						<Link to="UploadForm" style={{ textDecoration: 'none'}}> 
              <div className={styles.menuItems}>Upload <i className='bi bi-upload'/></div>
            </ Link>
					</button> 
				</div>

				{/* <UploadModal show={UploadState.modal} close={handleModal} />
				<UploadToast
				toast={UploadState.toast}
				close={() => setState({ ...UploadState, toast: '' })}
				/> */}
			</div>
  	)
}

export default UploadIcon
