import { Modal } from "../../(.)add-note/modal";
import EditNoteView from "@/components/EditNoteView";

export default async function NoteModal({
  params: { id: noteId },
}: {
  params: { id: string };
}) {

  const idAsNumber = Number(noteId);

  if (isNaN(idAsNumber)) {
    return <div>Invalid note id</div>;
  }

  return (
    <Modal>
      <EditNoteView id={idAsNumber} />
    </Modal>
  );
}
