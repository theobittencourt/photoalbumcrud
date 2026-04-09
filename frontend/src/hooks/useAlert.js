import Swal from 'sweetalert2';

export function useAlert() {
  const confirm = (title, text) =>
    Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
    });

  const success = (title) =>
    Swal.fire({ icon: 'success', title, timer: 1500, showConfirmButton: false });

  const error = (title) =>
    Swal.fire({ icon: 'error', title });

  return { confirm, success, error };
}
