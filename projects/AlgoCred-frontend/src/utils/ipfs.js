import axios from 'axios';

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

export const uploadToIPFS = async (file, studentName) => {
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
        name: `AlgoCred: ${studentName}`,
    });
    formData.append('pinataMetadata', metadata);

    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer ${PINATA_JWT}`
            }
        });
        return `ipfs://${res.data.IpfsHash}`;
    } catch (error) {
        console.error("IPFS Upload Error:", error);
        throw error;
    }
};