<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DraftPatientController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->except(['_token', 'draft_id']);
        $data['created_by'] = auth()->id();

        if ($request->filled('draft_id')) {
            $draft = \App\Models\DraftPatient::findOrFail($request->draft_id);
            $draft->update($data);
        } else {
            \App\Models\DraftPatient::create($data);
        }

        // Return to the index page with a success message
        return redirect()->route('patients.index')->with('success', 'Draft saved successfully');
    }

    public function destroy(\App\Models\DraftPatient $draft)
    {
        $draft->delete();
        return redirect()->back()->with('success', 'Draft deleted successfully');
    }
}
