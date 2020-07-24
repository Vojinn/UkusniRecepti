db.enablePersistence()
.catch(err => {
    if(err.code == 'failed-precondition'){
        console.log('persistence failed');
    } else if(err.code == 'unimplemented'){
        console.log('persistence is not available');
    }
});

db.collection('recepti').onSnapshot((snapshot) => {
    //console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        if(change.type === 'added'){
            renderRecipe(change.doc.data(), change.doc.id);
        }
        if(change.type === 'removed'){
            removeRecipe(change.doc.id);
        }
    });
});

// dodavanje novog receptad
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
    evt.preventDefault();
    
    const recipe = {
        Ime: form.title.value,
        Sastojci: form.ingredients.value
    };

    db.collection('recepti').add(recipe)
        .catch(err => console.log(err));

        form.title.value = '';
        form.ingredients.value = '';
});

// obrisi recept

const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', evt => {
    if(evt.target.tagName === 'I'){
        const id = evt.target.getAttribute('data-id');
        db.collection('recepti').doc(id).delete();
    }
});