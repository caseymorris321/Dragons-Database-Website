
document.addEventListener('DOMContentLoaded', function() {
  var submitBtn = document.getElementById('submitAbilityForm');
  if (submitBtn) {
      submitBtn.addEventListener('click', function() {
          alert("Ability added successfully");
      });
  }
});