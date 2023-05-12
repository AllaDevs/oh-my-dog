<script lang="ts">
  function sendEmail() {
    fetch('/api/email', {
      method: 'POST',
    })
      .then((res) => res.text())
      .then((text) => console.log(text))
      .catch((err) => console.error(err));
  }
</script>

<button on:click={() => sendEmail()}>Send email</button>
