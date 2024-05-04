import { Modal } from "./modal";
import AddNoteView from "@/components/AddNoteView";

export default async function AddNoteModal() {

  return (
    <Modal>
      <AddNoteView />
    </Modal>
  );
}
