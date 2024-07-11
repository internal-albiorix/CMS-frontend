import { downloadResume } from "../../services/ReferEmployeeService";
import { toast } from "react-toastify";
import DownloadIcon from "@mui/icons-material/Download";

function FileDownload({ fileName }: { fileName: string }) {
  const handleDownloadClick = async () => {
    try {
      const response = await downloadResume(fileName);
      const url = window.URL.createObjectURL(new Blob([response]));
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName; // Set the desired file name and extension here
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Something went wrong!!!");
    }
  };
  return (
    <div>
      <DownloadIcon style={{ cursor: "pointer" }} onClick={handleDownloadClick}>
        Download File
      </DownloadIcon>
    </div>
  );
}

export default FileDownload;
