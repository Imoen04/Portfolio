function showTab(id, btn) {
    document.querySelectorAll('.content').forEach(c => c.classList.remove('visible'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('visible');
    btn.classList.add('active');
}