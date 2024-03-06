document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('abilityAdded')) {
      alert("Ability added successfully");
      localStorage.removeItem('abilityAdded'); 
  }

  var submitBtn = document.getElementById('submitAbilityForm');
  if (submitBtn) {
      submitBtn.addEventListener('click', function(event) {
          localStorage.setItem('abilityAdded', true);
      });
  }
});